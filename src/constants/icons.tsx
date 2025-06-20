import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

type IconType = 'material' | 'ant' | 'materialIcons';

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  type?: IconType;
}

export const Icon = ({ name, color, size, type = 'material' }: IconProps) => {
  if (type === 'ant') {
    return <AntDesign name={name as any} color={color} size={size} />;
  }
  if (type === 'materialIcons') {
    return <MaterialIcon name={name as any} color={color} size={size} />;
  }
  // Por defecto o si type === 'material'
  return <MaterialCommunityIcons name={name as any} color={color} size={size} />;
};