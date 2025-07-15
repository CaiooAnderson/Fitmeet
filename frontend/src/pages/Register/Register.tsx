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

const registerSchema = z.object({
  name: z
    .string()
    .min(6, "O nome deve ter pelo menos 6 caracteres.")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "O espaço deve ser usado uma vez a cada separação de palavras.",
    }),
  cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter 11 dígitos numéricos."),
  email: z.string().email("Informe um e-mail válido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/^\S*$/, "A senha não pode conter espaços."),
});

function Register() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 409 || response.status === 400) {
        toast.error(errorData.error);
      } else {
        toast.error("Erro inesperado.");
      }

      return;
    }

    navigate("/");
    toast.success("Conta criada com sucesso!");
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(`Erro ao conectar com o servidor: ${err.message}`);
    } else {
      toast.error("Erro ao conectar com o servidor.");
    }
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
          <div className="flex flex-col w-2/3 md:w-80 gap-6 justify-center">
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
                CRIE SUA CONTA
              </h2>
              <h3 className="text-[var(--text)]">
                Cadastre-se para encontrar parceiros de treino e começar a se
                exercitar ao ar livre.
              </h3>
              <h3 className="text-[var(--text)] flex flex-row items-center gap-1">
                Vamos juntos!
                <BicepsFlexed
                  fill="#d4ff00"
                  stroke="#222"
                  className="h-4 w-4"
                />
              </h3>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text)]">
                        Nome Completo{" "}
                        <span className="text-[var(--warning)]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                          placeholder="Ex.: Caio Anderson"
                          type="text"
                          autoComplete="name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text)]">
                        CPF <span className="text-[var(--warning)]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                          placeholder="Ex.: 123.456.789-10"
                          type="text"
                          autoComplete="off"
                          required
                          {...field}
                          value={field.value
                            .slice(0, 11)
                            .replace(/(\d{3})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")}
                          onChange={(e) => {
                            const apenasNumeros = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11);
                            field.onChange(apenasNumeros);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text)]">
                        E-mail <span className="text-[var(--warning)]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                          placeholder="Ex.: caio@gmail.com"
                          type="email"
                          autoComplete="email"
                          required
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
                      <FormLabel className="text-[var(--text)]">
                        Senha <span className="text-[var(--warning)]">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
                            placeholder="Ex.: caio123"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
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
                  Cadastrar
                </Button>
              </form>
            </Form>

            <div className="md:mt-2 mt-0">
              <h3 className="flex flex-col text-[var(--text)] items-center justify-center lg:flex-row gap-2 text-sm whitespace-nowrap">
                Já tem uma conta?
                <Link to="/" className="font-bold hover:underline">
                  Faça login
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
