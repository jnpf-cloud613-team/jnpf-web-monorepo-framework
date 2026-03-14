interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface PermissionChildItem {
  enCode: string;
  fullName: string;
  id: string;
}

interface PermissionInfo {
  button: PermissionChildItem[];
  column: PermissionChildItem[];
  form: PermissionChildItem[];
  modelId: string;
  moduleName: string;
  resource: PermissionChildItem[];
}

interface SysConfigInfo {
  appIcon: Nullable<string>;
  companyName: Nullable<string>;
  copyright: Nullable<string>;
  defaultView: Nullable<string>;
  delegateAck: number;
  delegateScope: number;
  duration: number;
  firstDay: number;
  flowSign: number;
  flowTodo: number;
  jnpfDomain: Nullable<string>;
  loginIcon: Nullable<string>;
  logoIcon: Nullable<string>;
  navigationIcon: Nullable<string>;
  newUserDefaultPassword: Nullable<string>;
  proxyAck: number;
  proxyScope: number;
  showLunarCalendar: Nullable<boolean>;
  standingSwitch: number;
  sysName: Nullable<string>;
  sysVersion: Nullable<string>;
  title: Nullable<string>;
  workLogoIcon: Nullable<string>;
}

interface UserInfo {
  birthday: Nullable<number>;
  departmentId: Nullable<string>;
  departmentName: Nullable<string>;
  email: Nullable<string>;
  groupIds: string[];
  headIcon: Nullable<string>;
  isAdministrator: boolean;
  manager: Nullable<string>;
  mobilePhone: Nullable<string>;
  organizeId: Nullable<string>;
  organizeIds: Nullable<string[]>;
  organizeList: Nullable<any[]>;
  organizeName: Nullable<string>;
  portalId: Nullable<string>;
  positionId: Nullable<string>;
  positionIds: string[];
  positionList: any[];
  positionName: string;
  preferenceJson: string;
  prevLogin: number;
  prevLoginIPAddress: Nullable<string>;
  prevLoginIPAddressName: Nullable<string>;
  prevLoginTime: Nullable<number>;
  roleIds: string[];
  roleName: Nullable<string>;
  saasAppId: string;
  saasAppName: string;
  securityKey: string;
  signId: string;
  signImg: string;
  standingList: any[];
  systemCode: string;
  systemColor: string;
  systemIcon: string;
  systemId: string;
  systemName: string;
  userAccount: string;
  userId: string;
  userName: Nullable<string>;
}

interface GetUserInfoModel {
  menuList: BackMenu[];
  permissionList: PermissionInfo[];
  routerList: BackMenu[];
  sysConfigInfo: SysConfigInfo;
  userInfo: UserInfo;
}
type ClassType = Array<object | string> | object | string;

type BasicUserInfo = UserInfo;

export type { BasicOption, BasicUserInfo, ClassType, GetUserInfoModel, PermissionInfo, SelectOption, SysConfigInfo, TabOption, UserInfo };
