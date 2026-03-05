import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export function useTranslation() {
  return useContext(LanguageContext);
}
