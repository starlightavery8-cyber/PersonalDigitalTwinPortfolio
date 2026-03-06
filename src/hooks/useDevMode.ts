import { useContext } from 'react';
import { DevModeContext } from '../contexts/DevModeContext';

export function useDevMode() {
  return useContext(DevModeContext);
}
