import { List, ListItem, Button, HStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BiSolidHot } from "react-icons/bi";
import { BsRewindFill } from "react-icons/bs";

const RelesedDateSelector = () => {
  const dateSelectors = [
    {
      value: "last-30-days",
      label: "Last 30 Days",
      icon: IoCalendarNumberSharp,
    },
    { value: "this-week", label: "This Week", icon: BiSolidHot },
    { value: "last-week", label: "Last Week", icon: BsRewindFill },
  ];

  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("Error");
  }

  const { setDateRelesed } = context;

  return (
    <>
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
                  setDateRelesed(item.value);
                }}
                variant="link"
                ml="5px"
                background="transparent"
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.1)" }}
                fontWeight="extrabold"
                fontSize="15px"
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
    </>
  );
};

export default RelesedDateSelector;
