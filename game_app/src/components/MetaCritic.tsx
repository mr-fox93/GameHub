import { Badge } from "@chakra-ui/react";

interface Props {
  score: number;
}

const getColor = (score: number) => {
  if (score < 50) return "red";
  if (score < 75 && score > 50) return "yellow";
  if (score > 75) return "green";
};

const MetaCritic = ({ score }: Props) => {
  return (
    <Badge fontSize="15px" variant="outline" colorScheme={getColor(score)}>
      {score}
    </Badge>
  );
};

export default MetaCritic;
