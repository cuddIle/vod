import { Progress, Text } from "@mantine/core";

export default function StreamingProgressBar({ progress }: { progress: number }) {

  return (
    <div style={{ position: "relative", width: "100%" }} key={`{progressMap}`}>
      <Progress value={0} size="xl" radius="xl"/>
      {progress !== undefined ? (
        <Text
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
          }}
        >
          {`${Math.round(progress)}%`}
        </Text>
      ) : (
        <Text
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
          }}
        >
          Waiting...
        </Text>
      )}
    </div>
  );
}