export interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  open?: boolean;
  disabled?: boolean;
  selected?: boolean;
  matchRouter?: boolean;
  children?: MenuItem[];
}
export const menuList: MenuItem[] = [
  {
    title: '总览',
    icon: 'overview',
    link: 'overview',
    children: [
      {
        link: 'dashboard',
        title: '大屏',
        matchRouter: true,
      },
      {
        link: 'monitor',
        title: 'monitor',
        matchRouter: true,
      },
      {
        link: 'workplace',
        title: 'Workplace',
        matchRouter: true,
      },
    ],
  },
  {
    title: 'form',
    open: true,
    icon: 'overview',
    children: [
      {
        title: 'Basic Form',
        link: '',
      },
    ],
  },
  {
    title: '关于',
    icon: 'about',
    link: 'about',
    matchRouter: true,
  },
];
