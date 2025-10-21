import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export default function RatingStars({ value }: { value: string }) {
  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating name="read-only" value={parseFloat(value)} readOnly />
    </Box>
  );
}
