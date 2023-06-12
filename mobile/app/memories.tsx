import { ScrollView, TouchableOpacity, View, Image, Text } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import * as SecureStore from "expo-secure-store";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { api } from "../src/lib/api";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
//TODO  trabalhando com data
dayjs.locale(ptBr);
interface Memory {
  coverUrl: string;
  excerpt: string;
  createdAt: string;
  id: string;
}

export default function Memories() {
  // server para retorar a distancias (Tamanho) entre as telas nesse caso top e bottom
  const { bottom, top } = useSafeAreaInsets();
  const [memories, setMemories] = useState<Memory[]>([]);
  const router = useRouter();

  async function sigout() {
    await SecureStore.deleteItemAsync("token");

    router.push("/");
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("token");
    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
          {/* asChild serve para fazer TouchableOpacity  se comportar como link */}
          <Link href="/new" asChild>
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-purple-500">
              <Icon name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          </Link>

          <Link href="/new" asChild>
            <TouchableOpacity
              onPress={sigout}
              className="h-8 w-8 items-center justify-center rounded-full bg-red-500"
            >
              <Icon name="log-out" size={16} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {memories.map((memory) => (
        <View key={memory.id} className="mt-6 space-y-10">
          <View className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-100"></View>
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
              />
              <Text className="text-justify font-body text-base leading-relaxed text-gray-100">
                {" "}
                {memory.excerpt}
              </Text>
              <Link href="/memories/id" asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler Mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
