import DataLoader from "dataloader";
import { User } from "../entities/User";

//    [1, 78, 8, 9]
// -> [{userId: 1, userName: "..."}, {}, {}, {}]

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const user = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};

    user.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
