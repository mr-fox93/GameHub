import { IoLogoPlaystation } from "react-icons/io5";
import { FaXbox } from "react-icons/fa";
import { AiFillWindows, AiFillApple, AiFillAndroid } from "react-icons/ai";
import { SiNintendogamecube, SiSega, SiAtari } from "react-icons/si";
import { DiLinux } from "react-icons/di";
import { FaFirefoxBrowser } from "react-icons/fa";

interface Platform {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  platforms: Platform[];
}

const PlatformIcons = ({ platforms }: Props) => {
  return (
    <>
      {platforms.map((p) => {
        switch (p.name) {
          case "PlayStation":
            return (
              <IoLogoPlaystation key={p.id} color="gray" fontSize="18px" />
            );
          case "Xbox":
            return <FaXbox key={p.id} color="gray" fontSize="18px" />;
          case "PC":
            return <AiFillWindows key={p.id} color="gray" fontSize="18px" />;
          case "Nintendo":
            return (
              <SiNintendogamecube key={p.id} color="gray" fontSize="18px" />
            );
          case "iOS":
            return <AiFillApple key={p.id} color="gray" fontSize="19px" />;
          case "Android":
            return <AiFillAndroid key={p.id} color="gray" fontSize="19px" />;
          case "Linux":
            return <DiLinux key={p.id} color="gray" fontSize="19px" />;
          case "Web":
            return <FaFirefoxBrowser key={p.id} color="gray" fontSize="19px" />;
          case "SEGA":
            return <SiSega key={p.id} color="grey" fontSize="17px" />;
          case "Atari":
            return <SiAtari key={p.id} color="grey" fontSize="17px" />;

          default:
            return null;
        }
      })}
    </>
  );
};

export default PlatformIcons;
