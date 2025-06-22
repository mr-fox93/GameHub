import { Box, HStack, Skeleton, Stack } from "@chakra-ui/react";

const GenreListSkeleton = () => {
  return (
    <Stack spacing={2} mt={2}>
      {Array.from({ length: 8 }).map((_, idx) => (
        <HStack key={idx} spacing={3} h="40px">
          <Skeleton boxSize="40px" borderRadius="6px" />
          <Box flex="1">
            <Skeleton height="14px" width="70%" borderRadius="4px" />
          </Box>
        </HStack>
      ))}
    </Stack>
  );
};

export default GenreListSkeleton; 