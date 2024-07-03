import { ProLayout } from "@ant-design/pro-components";
import { usePathname, useRouter } from "next/navigation";

export default ({ children }: any) => {
  const pathname = usePathname();
  const router = useRouter();

  const route = {
    path: "/admin",
    routes: [
      {
        path: "/admin/dashboard",
        name: "欢迎"
      },
      {
        path: "/admin/voice",
        name: "主播管理",
        children: [
          {
            path: "/admin/voice/list",
            name: "主播列表"
          },
          {
            path: "/admin/voice/category",
            name: "主播分类"
          },
        ]
      },
      {
        path: "/admin/system",
        name: "系统管理",
        children: [
          {
            path: "/admin/system/dict",
            name: "字典管理",
          }
        ]
      }
    ]
  };

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh"
      }}
    >
      <ProLayout
        token={{
          header: {
            colorBgHeader: "#292f33",
            colorHeaderTitle: "#fff",
            colorTextMenu: "#dfdfdf",
            colorTextMenuSecondary: "#dfdfdf",
            colorTextMenuSelected: "#fff",
            colorBgMenuItemSelected: "#22272b",
            colorTextMenuActive: "rgba(255,255,255,0.85)",
            colorTextRightActionsItem: "#dfdfdf"
          },
          colorTextAppListIconHover: "#fff",
          colorTextAppListIcon: "#dfdfdf",
          sider: {
            colorMenuBackground: "#fff",
            colorMenuItemDivider: "#dfdfdf",
            colorTextMenu: "#595959",
            colorTextMenuSelected: "rgba(42,122,251,1)",
            colorBgMenuItemSelected: "rgba(230,243,254,1)"
          }
        }}
        route={route}
        location={{
          pathname
        }}
        layout="mix"
        menu={{
          type: "sub",
          defaultOpenAll: true,
          autoClose: false
        }}
        avatarProps={{
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: (
            <div
              style={{
                color: "#dfdfdf"
              }}
            >
              七妮妮
            </div>
          )
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item: any, dom) => (
          <a
            onClick={() => {
              router.push(item.path);
            }}
          >
            {dom}
          </a>
        )}
      >
        {children}
      </ProLayout>
    </div>
  );
};
