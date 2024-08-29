import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const createMyRestaurant = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accesstoken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to create restaurant");
    }
    return response.json();
  };

  const {
    mutate: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createMyRestaurant);

  if (isSuccess) {
    toast.success("Restaurant created successfully");
  }

  if (error) {
    toast.error("Failed to create restaurant");
  }
  return { createRestaurant, isLoading };
};

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch restaurant");
    }
    return response.json();
  };

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery("fetch-my-restaurant", getMyRestaurantRequest);

  if (error) {
    toast.error("Failed to fetch restaurant");
  }

  return { restaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateMyRestaurant = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accesstoken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to update restaurant");
    }
    return response.json();
  };

  const {
    mutate: updateRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(updateMyRestaurant);

  if (isSuccess) {
    toast.success("Restaurant updated successfully");
  }

  if (error) {
    toast.error("Failed to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useGetMyRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/restaurants/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  };

  const { data: orders, isLoading } = useQuery(
    "myRestaurantOrders",
    getMyRestaurantOrdersRequest
  );

  return { orders, isLoading };
};

type UpdateOrderStatusRequest = {
  orderId: string;
  status: string;
};

export const useUpdateMyRestaurantOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyRestaurantOrderRequest = async (
    updateStatusOrderRequest: UpdateOrderStatusRequest
  ) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/restaurants/order/${updateStatusOrderRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateStatusOrderRequest.status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update order");
    }
    return response.json();
  };

  const {
    mutateAsync: updateRestaurantStatus,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateMyRestaurantOrderRequest);

  if (isSuccess) {
    toast.success("Order updated successfully");
  }

  if (error) {
    toast.error("Failed to update order");
    reset();
  }

  return { updateRestaurantStatus, isLoading };
};
