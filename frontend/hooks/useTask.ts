import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { TaskSchemaDTO } from "@/schemas/taskSchema";

export function useTasks() {
  const queryClient = useQueryClient();

  const tasks = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      const responseData = res.data;
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      if (Array.isArray(responseData)) {
        return responseData;
      }
      return [];
    },
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const tasksById = (id: string) =>
    useQuery({
      queryKey: ["task", id],
      queryFn: async () => {
        const res = await api.get(`/tasks/${id}`);
        return res.data;
      },
      enabled: !!id,
    });

  const createTask = useMutation({
    mutationFn: async (payload: TaskSchemaDTO) => {
      const res = await api.post("/tasks", payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskSchemaDTO }) => {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task", vars.id] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { tasks, tasksById, createTask, updateTask, deleteTask };
}
