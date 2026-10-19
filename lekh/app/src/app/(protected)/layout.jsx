import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/provider/user-provider";
import { UsersProvider } from "@/provider/users-provider";
import { EquipmentProvider } from "@/provider/equipment-provider";
import { ArticleProvider } from "@/provider/article-provider";
import { ReservationsProvider } from "@/provider/reservations-provider";
import { TopBar } from "@/components/top-bar";
import { BottomBar } from "@/components/bottom-bar";
import { Toaster } from "@/components/ui/toast";
import { getUsersByIdQuery } from "@/query/user-query";

const ProtectedLayout = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const users = await getUsersByIdQuery(Number(session.user.id));
  const user = users[0];

  if (!user) {
    redirect("/login");
  }

  return (
    <UserProvider {...{ user }}>
      <EquipmentProvider>
        <ArticleProvider>
          <ReservationsProvider>
            <UsersProvider>
              <TopBar />
                {children}
              <Toaster />
              <BottomBar />
            </UsersProvider>
          </ReservationsProvider>
        </ArticleProvider>
      </EquipmentProvider>
    </UserProvider>
  );
};

export default ProtectedLayout;

