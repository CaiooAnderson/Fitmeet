import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CirclePlus, User, LogOut, Box } from "lucide-react";
import { useNavigate } from "react-router";

interface MenuHeaderProps {
  avatar: string;
  level: number;
  name: string;
  onLogout: () => void;
  onCreateActivity: () => void;
}

const MenuHeader = ({
  avatar,
  level,
  name,
  onLogout,
  onCreateActivity,
}: MenuHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between items-center w-full h-14">
      <div className="flex flex-row items-center gap-2 h-full justify-center">
        <img
          src="/Vector.svg"
          className="size-10 bg-gradient-to-b from-[#00bc7d] to-[#009966] rounded-lg flex-shrink-0 p-2"
        />
        <h1 className="font-bebas text-transparent bg-gradient-to-b from-[#00bc7d] to-[#009966] bg-clip-text text-[1.75rem] whitespace-nowrap sm:text-xl md:text-2xl">
          FITMEET
        </h1>
      </div>

      <div className="flex flex-row items-center gap-5 justify-between">
        <Button className="flex items-center h-10" onClick={onCreateActivity}>
          <CirclePlus className="size-5" />
          Criar atividade
        </Button>

        <div className="flex flex-col items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer p-[2px] rounded-full bg-gradient-to-b from-[#00BC7D] to-[#009966]">
                <div className="bg-white rounded-full p-[2px]">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      src={avatar?.replace("localstack", "localhost")}
                      alt="Avatar do usuário"
                      className="w-11 h-11 object-cover rounded-full"
                    />
                  </Avatar>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#00BC7D] to-[#009966] text-white text-xs font-bold px-2 py-[1px] rounded-sm shadow-md min-w-6 text-center">
                  {level ?? 1}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 mt-2 bg-[var(--background)]">
              <DropdownMenuItem disabled>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={avatar?.replace("localstack", "localhost")}
                  />
                </Avatar>
                <span className="text-sm font-medium truncate max-w-[8rem]">
                  {name}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="default"
                onClick={() => navigate("/menu")}
              >
                <Box className="rounded-full text-[#000]" />
                Menu Principal
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="default"
                onClick={() => navigate("/profile")}
              >
                <User className="rounded-full text-[#000]" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={onLogout}
                className="text-red-600"
              >
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;
