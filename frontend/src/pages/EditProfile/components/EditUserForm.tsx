import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const editUserSchema = z.object({
  name: z
    .string()
    .min(6, "O nome deve ter pelo menos 6 caracteres.")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "O espaço deve ser usado uma vez a cada separação de palavras.",
    }),
  email: z.string().email("Informe um e-mail válido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/^\S*$/, "A senha não pode conter espaços."),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: {
    name: string;
    email: string;
    cpf: string;
  };
  setUser: (user: any) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function EditUserForm({
  user,
  setUser,
  password,
  setPassword,
  showPassword,
  setShowPassword,
}: EditUserFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", password);
  }, [user, password, setValue]);
  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <Label className="text-[var(--text)] font-semibold text-[1rem] h-5">
          Nome completo <span className="text-[var(--warning)]">*</span>
        </Label>
        <Input
          {...register("name")}
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
          placeholder="Ex.: Caio Anderson"
          type="text"
          autoComplete="name"
        />
        {errors.name && (
          <span className="text-[13px] text-red-500">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[var(--text)] font-semibold text-[1rem] h-5">
          CPF <span className="text-[var(--warning)]">*</span>
        </Label>
        <Input
          value={user.cpf}
          disabled
          className="px-5 py-0 h-14 border-[var(--input-border)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[var(--text)] font-semibold text-[1rem] h-5">
          E-mail <span className="text-[var(--warning)]">*</span>
        </Label>
        <Input
          {...register("email")}
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
          placeholder="Ex.: caio@gmail.com"
          type="email"
          autoComplete="email"
        />
        {errors.email && (
          <span className="text-[13px] text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 relative">
        <Label className="text-[var(--text)] font-semibold text-[1rem] h-5">
          Senha <span className="text-[var(--warning)]">*</span>
        </Label>
        <Input
          {...register("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] placeholder-[var(--placeholder)] px-5 py-0 h-14"
          placeholder="Ex.: nova senha"
          type={showPassword ? "text" : "password"}
        />
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 bottom-4 cursor-pointer text-gray-400"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </div>
        {errors.password && (
          <span className="text-[13px] text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
    </div>
  );
}
