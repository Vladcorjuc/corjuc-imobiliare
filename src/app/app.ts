import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { LanguageService } from './i18n/language.service';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  label: { ro: string; en: string };
  specs?: { rooms?: string; area?: string; price?: string };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private langService = inject(LanguageService);

  t = this.langService.t;
  lang = this.langService.lang;

  isScrolled = false;
  menuOpen = false;
  activeCategory = signal('all');
  lightboxImage: GalleryImage | null = null;
  lightboxIndex = 0;

  images: GalleryImage[] = [
    // Apartments
    {
      src: 'images/bloc-apartamente.jpg',
      alt: 'Bloc de apartamente',
      category: 'apartments',
      label: { ro: 'Bloc de Apartamente', en: 'Apartment Building' },
      specs: { rooms: '2-4', area: '38-80 mp', price: '1.500 €/mp' },
    },
    {
      src: 'images/bloc-frontal.jpeg',
      alt: 'Bloc de apartamente - vedere frontala',
      category: 'apartments',
      label: { ro: 'Bloc de Apartamente - Frontal', en: 'Apartment Building - Front' },
      specs: { rooms: '2-4', area: '38-80 mp', price: '1.500 €/mp' },
    },
    {
      src: 'images/bloc-lateral.jpeg',
      alt: 'Bloc de apartamente - vedere laterala',
      category: 'apartments',
      label: { ro: 'Bloc de Apartamente - Lateral', en: 'Apartment Building - Side' },
      specs: { rooms: '2-4', area: '38-80 mp', price: '1.500 €/mp' },
    },
    {
      src: 'images/balcon-vedere.jpg',
      alt: 'Vedere de pe balcon',
      category: 'apartments',
      label: { ro: 'Vedere de pe Balcon', en: 'Balcony View' },
    },
    // Duplex
    {
      src: 'images/duplex.jpg',
      alt: 'Duplex',
      category: 'duplex',
      label: { ro: 'Duplex', en: 'Duplex' },
      specs: { rooms: '4', area: '90 mp', price: '1.500 €/mp' },
    },
    {
      src: 'images/duplex-2.jpeg',
      alt: 'Duplex in constructie',
      category: 'duplex',
      label: { ro: 'Duplex - Vedere Frontală', en: 'Duplex - Front View' },
      specs: { rooms: '4', area: '90 mp', price: '1.500 €/mp' },
    },
    // Development
    {
      src: 'images/ansamblu-aerial.jpg',
      alt: 'Ansamblu rezidential - vedere aeriana',
      category: 'development',
      label: { ro: 'Ansamblu Rezidențial - Vedere Aeriană', en: 'Residential Development - Aerial View' },
    },
    {
      src: 'images/strada-ansamblu.jpg',
      alt: 'Strada ansamblu rezidential',
      category: 'development',
      label: { ro: 'Ansamblu Rezidențial - Stradă', en: 'Residential Development - Street' },
    },
    // Individual houses - La comandă
    {
      src: 'images/casa-garage.jpg',
      alt: 'Casa individuala cu garaj',
      category: 'houses',
      label: { ro: 'Casă Individuală cu Garaj', en: 'Individual House with Garage' },
      specs: { rooms: 'La comandă', area: '', price: '' },
    },
    {
      src: 'images/casa-individuala.jpg',
      alt: 'Casa individuala',
      category: 'houses',
      label: { ro: 'Casă Individuală', en: 'Individual House' },
      specs: { rooms: 'La comandă', area: '', price: '' },
    },
  ];

  categories = [
    { key: 'all' as const },
    { key: 'houses' as const },
    { key: 'duplex' as const },
    { key: 'apartments' as const },
    { key: 'development' as const },
  ];

  filteredImages = computed(() => {
    const cat = this.activeCategory();
    this.lang();
    if (cat === 'all') return this.images;
    return this.images.filter((img) => img.category === cat);
  });

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  setCategory(key: string): void {
    this.activeCategory.set(key);
  }

  toggleLang(): void {
    this.langService.toggle();
  }

  openLightbox(img: GalleryImage): void {
    this.lightboxImage = img;
    this.lightboxIndex = this.filteredImages().indexOf(img);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxImage = null;
    document.body.style.overflow = '';
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const imgs = this.filteredImages();
    this.lightboxIndex = (this.lightboxIndex - 1 + imgs.length) % imgs.length;
    this.lightboxImage = imgs[this.lightboxIndex];
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const imgs = this.filteredImages();
    this.lightboxIndex = (this.lightboxIndex + 1) % imgs.length;
    this.lightboxImage = imgs[this.lightboxIndex];
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxImage) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowLeft') this.prevImage(event);
    if (event.key === 'ArrowRight') this.nextImage(event);
  }

  sendEmail(): void {
    const subject = this.lang() === 'ro' ? 'Mesaj de pe site Corjuc Imobiliare' : 'Message from Corjuc Imobiliare website';
    window.location.href = `mailto:corneliucorjuc@gmail.com?subject=${encodeURIComponent(subject)}`;
  }
}
