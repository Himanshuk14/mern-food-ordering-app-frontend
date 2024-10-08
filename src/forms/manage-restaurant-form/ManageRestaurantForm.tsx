import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({ required_error: "Restaurant name is required" }),
    city: z.string({ required_error: "city  is required" }),
    country: z.string({ required_error: "country  is required" }),
    deliveryPrice: z.coerce.number({
      required_error: "delivery price is required",
      invalid_type_error: "delivery price must be a number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Estimated Delivery time is required",
      invalid_type_error: "Estimated Delivery time must be a number",
    }),
    cuisines: z
      .array(z.string())
      .nonempty({ message: "please select at least one cuisine" }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1, "price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "image is required",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (restaurantFormData: FormData) => void;
  restaurant?: Restaurant;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ restaurant, onSave, isLoading }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) return;
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );
    const menuItemsFormatted = restaurant.menuItems.map((Item) => ({
      ...Item,
      price: parseInt((Item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    };
    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  const onSubmit = (formJsonData: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("restaurantName", formJsonData.restaurantName);
    formData.append("city", formJsonData.city);
    formData.append("country", formJsonData.country);
    formData.append(
      "deliveryPrice",
      (formJsonData.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formJsonData.estimatedDeliveryTime.toString()
    );
    formJsonData.cuisines.forEach((cuisine, index) =>
      formData.append(`cuisines[${index}]`, cuisine)
    );
    formJsonData.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString()
      );
    });
    if (formJsonData.imageFile) {
      formData.append("imageFile", formJsonData.imageFile);
    }

    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
