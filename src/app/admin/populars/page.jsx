"use client";
import Container from "@/components/container";
import { LoaderButton } from "@/components/loader-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useServerAction } from "zsa-react";
import { addPopularAction, reOrderPopularAction } from "./action";
import { useToast } from "@/hooks/use-toast";
import PopularDeleteButton from "./_components/delete-popular-button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { queryClient } from "@/lib/react-query";
import { DragDropContext } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/config";
import ErrorMessage from "@/components/error-message";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPopulars = async () => {
  return await apiClient.get("/populars");
};

const schema = z.object({
  country: z.string().min(2, { message: "Too short" }),
});

const getLabel = (name) => {
  const n = COUNTRIES.find((c) => c.value === name);
  return n ? n.label : name;
};

export default function Populars() {
  const [items, setItems] = useState([]);
  const [shuffled, setShuffled] = useState(false);
  const [update, setUpdate] = useState(false);
  const { toast } = useToast();

  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: ["populars"],
    queryFn: fetchPopulars,
  });

  const SyncItems = () => {
    setItems(data);
  };

  useEffect(() => {
    if (data) {
      SyncItems();
    }
  }, [data]);

  const form = useForm({
    mode: "onchange",
    resolver: zodResolver(schema),
  });

  const {
    execute,
    isPending: isP,
    erorr: err,
  } = useServerAction(addPopularAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      form.reset();
      queryClient.invalidateQueries(["populars"]);
      toast({
        title: "Deleted country Sucessfully",
        variant: "success",
      });
    },
  });

  const {
    execute: reorder,
    isPending: isReorderPending,
    erorr: reorderError,
  } = useServerAction(reOrderPopularAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      form.reset();
      setUpdate(false);
      queryClient.invalidateQueries(["populars"]);
      toast({
        title: "Reordered Sucessfully",
        variant: "success",
      });
    },
  });

  const onSubmit = async (values) => {
    execute(values);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
    setShuffled(true);
  };

  const handleReorder = () => {
    const data = items.map((it, i) => {
      return { id: it.id, rank: i + 1 };
    });
    reorder({ countries: data });
  };

  return (
    <main>
      <Container>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-4  justify-center"
          >
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-64 shrink">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem value={c.value} key={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <LoaderButton isLoading={isP} type="submit">
              Add
            </LoaderButton>
          </form>
        </Form>
        {isPending ? (
          <div className="flex flex-wrap gap-8 mt-12">
            {[...Array(6)].map((_, i) => (
              <div className=" basis-64 shrink grow " key={i}>
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage message={error.message} retry={refetch} />
        ) : !data.length ? (
          <div className="text-center mt-12">Add a popular country</div>
        ) : (
          <div className="flex flex-col gap-8">
            {update ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div
                      className="mt-12 flex flex-col gap-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {items.map((d, index) => (
                        <Draggable
                          key={d.id}
                          draggableId={d.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="flex gap-4 items-center py-2 px-4 bg-gray-100 rounded-sm min-w-48 w-fit"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h4 className="text-header text-lg">
                                {getLabel(d.country)}
                              </h4>
                              <PopularDeleteButton
                                tobedeltedId={{ id: d.id }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}{" "}
                      {/* This placeholder is required */}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="mt-12 flex flex-wrap gap-2">
                {items.map((d) => (
                  <div
                    key={d.id}
                    className="flex gap-4 items-center py-2 px-4 bg-gray-100 rounded-sm min-w-48 w-fit"
                  >
                    <h4 className="text-header text-lg">
                      {getLabel(d.country)}
                    </h4>
                    <PopularDeleteButton tobedeltedId={{ id: d.id }} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-8">
              {update ? (
                <>
                  <Button
                    onClick={() => {
                      setUpdate(false);
                      SyncItems();
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  {shuffled ? (
                    <LoaderButton
                      isLoading={isReorderPending}
                      onClick={() => {
                        handleReorder(items);
                      }}
                    >
                      save
                    </LoaderButton>
                  ) : (
                    ""
                  )}
                </>
              ) : data.length > 1 ? (
                <Button variant="outline" onClick={() => setUpdate(true)}>
                  Reorder
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
