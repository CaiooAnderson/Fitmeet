import "../../index.css";
import { useState } from "react";
import { BicepsFlexed, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().min(1, "Este campo é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Este campo é obrigatório"),
});

function Login() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400 || 401 || 403 || 404) {
          toast.error("Credenciais inválidas.");
        } else {
          toast.error("Erro inesperado.");
        }
        return;
      }

      const responseData = await response.json();

      sessionStorage.setItem("token", responseData.token);
      toast.success("Login bem-sucedido!");
      navigate("/menu");
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  return (
    <>
      <div className="flex md:h-lvh h-full w-screen md:py-0 py-4">
        <div className="hidden h-full w-1/2 md:block p-3">
          <img
            src="/image.svg"
            alt="Imagem da tela principal"
            className="w-full h-full object-cover rounded-[0.75rem]"
          />
        </div>

        <div className="flex justify-center items-center bg-white w-full h-full md:w-1/2">
          <div className="flex flex-col md:w-80 w-2/3 gap-6">
            <div className="flex flex-row items-center gap-2 mb-0 md:mb-6">
              <img
                src="/Vector.svg"
                className="size-10 bg-gradient-to-t from-[#00bc7d] to-[#009966] rounded-lg flex-shrink-0 p-2"
              />
              <h1 className="font-bebas text-transparent bg-gradient-to-t from-[#00bc7d] to-[#009966] bg-clip-text text-[1.75rem] whitespace-nowrap sm:text-xl md:text-2xl">
                FITMEET
              </h1>
            </div>
            <div className="flex flex-col">
              <h2 className="font-bebas text-[var(--title)] text-[2rem] mb-3">
                BEM-VINDO DE VOLTA!
              </h2>
              <h3 className="text-[var(--text)]">
                Encontre parceiros para treinar ao ar livre.
              </h3>
              <h3 className="text-[var(--text)] font-sans">
                Conecte-se e{" "}
                <span className="inline-flex items-center gap-1 whitespace-nowrap font-sans">
                  comece agora!{" "}
                  <BicepsFlexed
                    fill="#d4ff00"
                    stroke="#222"
                    className="h-4 w-4"
                  />
                </span>
              </h3>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text)] text-[1rem]">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                          placeholder="Ex.: caio@gmail.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text)] text-[1rem]">
                        Senha
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            className="pr-10 focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                            placeholder="Ex.: caio123"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <div
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-600)]"
                >
                  Entrar
                </Button>
              </form>
            </Form>

            <div className="md:mt-2 mt-0">
              <h3 className="flex flex-col text-[var(--text)] items-center justify-center lg:flex-row gap-2 text-sm whitespace-nowrap font-sans">
                Ainda não tem uma conta?
                <Link
                  to="/register"
                  className="font-bold font-sans hover:underline"
                >
                  Cadastre-se
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
