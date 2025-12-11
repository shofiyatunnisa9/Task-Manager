import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { LoginSchemaDTO, RegisterSchemaDTO } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const login = useMutation({
    mutationFn: async (payload: LoginSchemaDTO) => {
      const res = await api.post("/auth/login", payload);

      localStorage.setItem("token", res.data.access_token);

      return res.data;
    },
    onSuccess: () => {
      router.push("/tasks");
    },
  });

  const registerForm = useMutation({
    mutationFn: async (payload: RegisterSchemaDTO) => {
      const res = await api.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return { login, registerForm, logout };
}
