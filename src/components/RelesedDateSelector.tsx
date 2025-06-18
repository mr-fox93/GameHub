import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsRewindFill, BsFillFastForwardFill } from "react-icons/bs";
import { BiSolidHot } from "react-icons/bi";
import { IoCalendarNumberSharp } from "react-icons/io5";
import useGameQueryStore from "../store";

const getRecentToFutureDateRange = () => {
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);
  const futureDate = "2030-12-31";
  return `${pastDate.toISOString().split("T")[0]},${futureDate}`;
};

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
  const genreId = useGameQueryStore((state) => state.gameQuery.genreId);
  const dateReleased = useGameQueryStore((state) => state.gameQuery.dateReleased);
  const isSearchActive = useGameQueryStore((state) => state.isSearchActive);

  const titleColor = useColorModeValue("gray.800", "white");
  const selectorBg = useColorModeValue("white", "gray.800");
  const selectorHoverBg = useColorModeValue("gray.50", "gray.700");
  const selectorSelectedBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const selectedBorderColor = useColorModeValue("blue.500", "blue.300");

  useEffect(() => {
    if (isSearchActive) {
      setDate("");
      setName("");
    }
  }, [isSearchActive]);

  useEffect(() => {
    const defaultDateRange = getRecentToFutureDateRange();
    if (dateReleased === defaultDateRange || !dateReleased) {
      setDate("");
      setName("");
    }
  }, [dateReleased]);

  const handleDateSelection = (selectedValue: string) => {
    if (isSearchActive) return;
    
    if (name === selectedValue) {
      setDate("");
      setName("");
      if (genreId) {
        setDateRelesed(getRecentToFutureDateRange());
      } else {
        setDateRelesed(getRecentToFutureDateRange());
      }
    } else {
      setDate(selectedValue);
      setName(selectedValue);
    }
  };

  useEffect(() => {
    if (!date) return;

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
    <Flex flexDirection="column" padding={3} gap={2}>
      <Text fontSize="25px" fontWeight="extrabold" color={titleColor}>
        New Release
      </Text>
      <Flex direction="column" gap={2}>
        {dateSelectors.map((selector) => (
          <Box
            key={selector.value}
            onClick={() => handleDateSelection(selector.value)}
            cursor={isSearchActive ? "not-allowed" : "pointer"}
            p={3}
            bg={name === selector.value && !isSearchActive ? selectorSelectedBg : selectorBg}
            borderRadius="8px"
            border="1px solid"
            borderColor={name === selector.value && !isSearchActive ? selectedBorderColor : borderColor}
            transition="all 0.2s ease"
            opacity={isSearchActive ? 0.5 : 1}
            _hover={{
              bg: isSearchActive ? selectorBg : (name === selector.value ? selectorSelectedBg : selectorHoverBg),
              transform: isSearchActive ? "none" : "translateY(-1px)",
              boxShadow: isSearchActive ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Flex align="center" gap={3}>
              <Icon
                as={selector.icon}
                boxSize={5}
                color={name === selector.value && !isSearchActive ? selectedBorderColor : iconColor}
              />
              <Text
                fontSize="md"
                fontWeight={name === selector.value && !isSearchActive ? "bold" : "medium"}
                color={titleColor}
              >
                {selector.label}
              </Text>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default RelesedDateSelector;
