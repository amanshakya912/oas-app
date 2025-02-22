import * as SecureStore from "expo-secure-store";

export type UserDataType = {
  token: string | null;
  username: string | null;
  id: string | null;
};

const UserData = async (): Promise<UserDataType> => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const username = await SecureStore.getItemAsync("username");
    const id = await SecureStore.getItemAsync("id");

    console.log("Token:", token);
    console.log("Username:", username);
    console.log("ID:", id);

    return { token, username, id };
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { token: null, username: null, id: null };
  }
};

export default UserData;
