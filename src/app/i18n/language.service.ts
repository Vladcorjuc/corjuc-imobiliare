import { Injectable, signal, computed } from '@angular/core';
import { RO, EN, Translations } from './translations';

export type Lang = 'ro' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = signal<Lang>('ro');

  lang = this.currentLang.asReadonly();

  t = computed<Translations>(() => (this.currentLang() === 'ro' ? RO : EN));

  toggle(): void {
    this.currentLang.update((l) => (l === 'ro' ? 'en' : 'ro'));
  }

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
  }
}
