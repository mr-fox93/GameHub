import { List, ListItem, Button, HStack, Text, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BiSolidHot } from "react-icons/bi";
import { BsRewindFill, BsFillFastForwardFill } from "react-icons/bs";
import useGameQueryStore from "../store"; // Import the store

const RelesedDateSelector = () => {
  const [date, setDate] = useState<string>("");

  const [name, setName] = useState<string>("");

  const dateSelectors = [
    {
      value: "last-30-days",
      label: "Last 30 Days",
      icon: IoCalendarNumberSharp,
    },
    { value: "this-week", label: "This Week", icon: BiSolidHot },
    { value: "last-week", label: "Last Week", icon: BsRewindFill },
    { value: "next-week", label: "Next Week", icon: BsFillFastForwardFill },
  ];

  const setDateRelesed = useGameQueryStore((state) => state.setDateReleased);
  const setGenreId = useGameQueryStore((state) => state.setGenreId);

  //const dateReleased = useGameQueryStore((state)=> state.gameQuery.dateReleased)

  useEffect(() => {
    let dateFilter;

    switch (date) {
      case "last-30-days": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = `${thirtyDaysAgo.toISOString().split("T")[0]},${
          new Date().toISOString().split("T")[0]
        }`;
        break;
      }
      case "this-week": {
        const startOfWeek = new Date();
        startOfWeek.setDate(
          startOfWeek.getDate() -
            startOfWeek.getDay() +
            (startOfWeek.getDay() === 0 ? -6 : 1)
        );
        dateFilter = `${startOfWeek.toISOString().split("T")[0]},${
          new Date().toISOString().split("T")[0]
        }`;
        break;
      }
      case "last-week": {
        const startOfLastWeek = new Date();
        startOfLastWeek.setDate(
          startOfLastWeek.getDate() -
            7 -
            startOfLastWeek.getDay() +
            (startOfLastWeek.getDay() === 0 ? -6 : 1)
        );
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
        dateFilter = `${startOfLastWeek.toISOString().split("T")[0]},${
          endOfLastWeek.toISOString().split("T")[0]
        }`;
        break;
      }
      case "next-week": {
        const startOfNextWeek = new Date();
        startOfNextWeek.setDate(
          startOfNextWeek.getDate() +
            7 -
            startOfNextWeek.getDay() +
            (startOfNextWeek.getDay() === 0 ? -6 : 1)
        );
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
        dateFilter = `${startOfNextWeek.toISOString().split("T")[0]},${
          endOfNextWeek.toISOString().split("T")[0]
        }`;
        break;
      }

      default: {
        break;
      }
    }

    setDateRelesed(dateFilter || "");
  }, [date, setDateRelesed]);

  return (
    <>
      <Button
        variant="ghost"
        fontSize="25px"
        fontWeight="extrabold"
        justifyContent="flex-start"
        onClick={() => {
          setDate(""), setName(""), setDateRelesed(""), setGenreId(null);
        }}
      >
        Home
      </Button>
      <Flex flexDirection="column" padding={3} justifyContent="flex-start">
        <Text fontSize="25px" fontWeight="extrabold" mb="7px">
          New Releases
        </Text>
        <List>
          {dateSelectors.map((item) => (
            <ListItem key={item.value}>
              <HStack>
                <item.icon size={30} />
                <Button
                  onClick={() => {
                    setDate(item.value);
                    setName(item.value);
                  }}
                  variant={item.value === name ? "outline" : "link"}
                  ml="5px"
                  background="transparent"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.1)" }}
                  fontWeight={item.value === name ? "extrabold" : "bold"}
                  fontSize={item.value === name ? "17px" : "15px"}
                  textDecoration="none"
                  gap="5px"
                  padding="10px"
                >
                  {item.label}
                </Button>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Flex>
    </>
  );
};

export default RelesedDateSelector;
