import { Avatar } from "@mui/material";
import Link from "next/link";
import { ComponentProps } from "react";

export default function LinkAvatar({
  userId,
  photoUrl,
}: { userId: string; photoUrl?: string } & ComponentProps<"a">) {
  return (
    <Link href={`/profile/${userId}`}>
      <Avatar
        src={photoUrl}
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          letterSpacing: "-0.035em",
        }}
      />
    </Link>
  );
}
