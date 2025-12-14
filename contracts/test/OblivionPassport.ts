import { expect } from "chai";
import hre from "hardhat";
import { keccak256, stringToBytes } from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

async function deployFixture() {
  const [admin, user, other] = await hre.viem.getWalletClients();

  const verifier = await hre.viem.deployContract("MockVerifier", [true]);
  const passport = await hre.viem.deployContract("OblivionPassport", [
    admin.account.address,
    verifier.address,
  ]);

  return { admin, user, other, verifier, passport };
}

describe("OblivionPassport", () => {
  it("mints once per address and stores attributes", async () => {
    const { admin, user, passport } = await loadFixture(deployFixture);
    const identityHash = keccak256(stringToBytes("user-1"));

    await passport.write.mintPassport(
      [
        user.account.address,
        {
          isVerified: true,
          isAdult: true,
          isHuman: true,
          isNotSanctioned: true,
          isUnique: true,
          identityHash,
        },
        "0x",
        [],
        "ipfs://meta",
      ],
      { account: admin.account }
    );

    const attrs = await passport.read.getAttributes([1n]);
    expect(attrs.identityHash).to.equal(identityHash);
    expect(attrs.isAdult).to.equal(true);
    expect(await passport.read.ownerOf([1n])).to.equal(user.account.address);

    await expect(
      passport.write.mintPassport(
        [
          user.account.address,
          {
            isVerified: true,
            isAdult: true,
            isHuman: true,
            isNotSanctioned: true,
            isUnique: true,
            identityHash,
          },
          "0x",
          [],
          "ipfs://meta",
        ],
        { account: admin.account }
      )
    ).to.be.rejectedWith("AlreadyMinted()");
  });

  it("blocks transfers (soulbound)", async () => {
    const { admin, user, other, passport } = await loadFixture(deployFixture);
    const identityHash = keccak256(stringToBytes("user-2"));

    await passport.write.mintPassport(
      [
        user.account.address,
        {
          isVerified: true,
          isAdult: true,
          isHuman: true,
          isNotSanctioned: true,
          isUnique: true,
          identityHash,
        },
        "0x",
        [],
        "ipfs://meta",
      ],
      { account: admin.account }
    );

    await expect(
      passport.write["safeTransferFrom(address,address,uint256)"](
        [user.account.address, other.account.address, 1n],
        { account: user.account }
      )
    ).to.be.rejectedWith("Soulbound()");
  });

  it("revokes passports", async () => {
    const { admin, user, passport } = await loadFixture(deployFixture);
    const identityHash = keccak256(stringToBytes("user-3"));

    await passport.write.mintPassport(
      [
        user.account.address,
        {
          isVerified: true,
          isAdult: true,
          isHuman: true,
          isNotSanctioned: true,
          isUnique: true,
          identityHash,
        },
        "0x",
        [],
        "ipfs://meta",
      ],
      { account: admin.account }
    );

    await passport.write.revoke([1n, "fraud"], { account: admin.account });
    await expect(passport.read.getAttributes([1n])).to.be.rejectedWith("Revoked()");
  });
});



