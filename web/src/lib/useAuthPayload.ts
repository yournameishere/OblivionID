"use client";

import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";

export function useAuthPayload() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const getAuthPayload = useCallback(async () => {
    if (!address) return null;
    try {
      const { data } = await axios.get("/api/auth/message");
      const message = data.message;
      const signature = await signMessageAsync({ message });
      return { address, message, signature };
    } catch {
      return null;
    }
  }, [address, signMessageAsync]);

  return { getAuthPayload, address };
}
