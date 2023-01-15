import { SoftwrkApi } from "configs/StoreQueryConfig";

const BASE_URL = "/InventoryApp/api/Inventory/";

export const UserApi = SoftwrkApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/signup`,
        method: "POST",
        ...config,
      }),
    }),
    login: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/login`,
        method: "POST",
        ...config,
      }),
    }),

    createInventory: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/create-inventory`,
        method: "POST",
        ...config,
      }),
    }),
  }),
});

export default UserApi;
