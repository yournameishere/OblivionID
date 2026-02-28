pragma circom 2.1.6;

// Minimal KYC passport circuit: proves 5 boolean flags (public inputs)
// Public inputs: isVerified, isAdult, isHuman, isNotSanctioned, isUnique
// Each must be 0 or 1 (binary constraint)

template Passport() {
    signal input isVerified;
    signal input isAdult;
    signal input isHuman;
    signal input isNotSanctioned;
    signal input isUnique;
    signal output out;

    // Ensure all inputs are binary (0 or 1)
    isVerified * (isVerified - 1) === 0;
    isAdult * (isAdult - 1) === 0;
    isHuman * (isHuman - 1) === 0;
    isNotSanctioned * (isNotSanctioned - 1) === 0;
    isUnique * (isUnique - 1) === 0;

    // Output 1 for valid proof
    out <== 1;
}

component main = Passport();
