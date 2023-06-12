"use client"
import { Camera } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { MediaPicker } from "./MediaPicker";
import { api } from "@/lib/api";
import Cookie from "js-cookie"
import { useRouter } from "next/navigation";


export function NewMemory() {
const router = useRouter();


  async function handlerCreateMemory(event: FormEvent<HTMLFormElement>) {
    // Evita o envio padrão do formulário
    event.preventDefault(); 
  // Cria uma instância de FormData usando o formulário atual
    const formData = new FormData(event.currentTarget); 
  // Obtém o valor do campo de formulário com o nome "coverUrl"
    const fileToUpload = formData.get("coverUrl"); 
   
    let coverUrl =""

    // Verifica se há um arquivo selecionado
    if (fileToUpload) { 
      // Cria uma nova instância de FormData
      const uploadFormData = new FormData(); 
     // Define o par chave-valor para o arquivo a ser enviado
      uploadFormData.set("file", fileToUpload); 
     // Envia a requisição POST para "/upload" com o FormData
      const uploadResponse = await api.post("/upload", uploadFormData); 
      
      coverUrl = uploadResponse.data.fileUrl
    }
     
     const token = Cookie.get("token")

     await api.post("/memories", {
      coverUrl,
      content: formData.get("content"),
      isPublic: formData.get("isPublic"),
     }, {
       headers:{
        Authorization: `Bearer ${token}`
       }
     }
     ); 
     router.push("/")
  }



  return ( 
    <form onSubmit={handlerCreateMemory}  className="flex flex-1 flex-col gap-2 p-16">
    <div className="flex items-center gap-4"> 
      <label
        htmlFor="media"
        className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
      >
        <Camera className="h-4 w-4" />
        Anexar mídia
      </label>

      <label
        htmlFor="isPublic"
        className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
      >
        <input
          type="checkbox"
          name="isPublic"
          id="isPublic"
          value="true"
          className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
        />
        Tornar memória pública
      </label>
    </div>
    <MediaPicker />
    

    <textarea
      name="content"
      spellCheck={false}
      className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
      placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
    />

    <button  className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase self-end leading-none text-black hover:bg-green-600">
      Salvar
    </button>
  </form>
  );
}
