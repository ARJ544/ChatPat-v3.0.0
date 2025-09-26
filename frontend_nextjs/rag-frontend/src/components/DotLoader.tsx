import EllipsisLoading from ;
import { View } from "lucide-react"

interface DotLoaderProps {
  backgroundColor?: string; // color of dots
  margin?: number;
}

const DotLoader: React.FC<DotLoaderProps> = ({
  backgroundColor = "#6c5ce7",
  margin = 5,
}) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <EllipsisLoading
        styleDot={{
          backgroundColor,
          margin,
        }}
      />
    </View>
  );
};

