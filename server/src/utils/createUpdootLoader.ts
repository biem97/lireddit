import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";

//    [{postId: 5, userId: 10},...]
// -> [{postId: 5, userId: 10, value: 1}]

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootsIdsToUpdoots: Record<string, Updoot> = {};

      updoots.forEach((updoot) => {
        updootsIdsToUpdoots[`${updoot.userId}|${updoot.postId}`] = updoot;
      });

      return keys.map(
        (key) => updootsIdsToUpdoots[`${key.userId}|${key.postId}`]
      );
    }
  );
