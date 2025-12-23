import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useSongs() {
  return useQuery({
    queryKey: [api.songs.list.path],
    queryFn: async () => {
      const res = await fetch(api.songs.list.path);
      if (!res.ok) throw new Error("Failed to fetch songs");
      return api.songs.list.responses[200].parse(await res.json());
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isFavorite }: { id: number; isFavorite: boolean }) => {
      const url = buildUrl(api.songs.toggleFavorite.path, { id });
      const res = await fetch(url, {
        method: api.songs.toggleFavorite.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Song not found");
        throw new Error("Failed to toggle favorite");
      }
      return api.songs.toggleFavorite.responses[200].parse(await res.json());
    },
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: [api.songs.list.path] });
      const previousSongs = queryClient.getQueryData([api.songs.list.path]);

      queryClient.setQueryData([api.songs.list.path], (old: any[]) => {
        return old?.map((song) => 
          song.id === id ? { ...song, isFavorite } : song
        );
      });

      return { previousSongs };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData([api.songs.list.path], context?.previousSongs);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update favorite status.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.songs.list.path] });
    },
  });
}
