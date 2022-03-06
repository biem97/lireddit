import DataLoader from "dataloader";
import { User } from "../entities/User";

//    [1, 78, 8, 9]
// -> [{userId: 1, userName: "..."}, {}, {}, {}]

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const usersIdToUsers: Record<number, User> = {};

    users.forEach((u) => {
      usersIdToUsers[u.id] = u;
    });

    return userIds.map((userId) => usersIdToUsers[userId]);
  });
