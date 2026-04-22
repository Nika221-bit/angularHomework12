import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  country: number;
}

interface FormData {
  countryId: number | null;
  countryName: string;
  cityId: number | null;
  cityName: string;
  color: string;
  fullbody: string;
  active: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private defaultCountries: Country[] = [
    { id: 1, name: 'საქართველო' },
    { id: 2, name: 'საფრანგეთი' },
    { id: 3, name: 'გერმანია' },
    { id: 4, name: 'იტალია' },
    { id: 5, name: 'ესპანეთი' }
  ];

  private defaultCities: City[] = [
    { id: 10, name: 'თბილისი', country: 1 },
    { id: 11, name: 'ბათუმი', country: 1 },
    { id: 12, name: 'ქუთაისი', country: 1 },
    { id: 13, name: 'პარიზი', country: 2 },
    { id: 14, name: 'მარსელი', country: 2 },
    { id: 15, name: 'ბერლინი', country: 3 },
    { id: 16, name: 'მიუნხენი', country: 3 },
    { id: 17, name: 'რომი', country: 4 },
    { id: 18, name: 'მილანი', country: 4 },
    { id: 19, name: 'მადრიდი', country: 5 },
    { id: 20, name: 'ბარსელონა', country: 5 }
  ];

  countries: Country[] = [];
  cities: City[] = [];

  selectedCountry: number | null = null;
  selectedCity: number | null = null;
  selectedColor: string = '#000000';
  fullbody: string = '';
  active: boolean = false;

  isSubmitted: boolean = false;
  submittedData: FormData | null = null;

  countryError: string = '';
  cityError: string = '';
  colorError: string = '';
  fullbodyError: string = '';
  activeError: string = '';

  constructor() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage(): void {
    const storedCountries = localStorage.getItem('countries');
    const storedCities = localStorage.getItem('cities');

    if (storedCountries && storedCities) {
      this.countries = JSON.parse(storedCountries);
      this.cities = JSON.parse(storedCities);
    } else {
      this.countries = [...this.defaultCountries];
      this.cities = [...this.defaultCities];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('countries', JSON.stringify(this.countries));
    localStorage.setItem('cities', JSON.stringify(this.cities));
  }

  getFilteredCities(): City[] {
    if (!this.selectedCountry) {
      return [];
    }
    return this.cities.filter(city => city.country === this.selectedCountry);
  }

  get isCityDisabled(): boolean {
    return this.selectedCountry === null;
  }

  onCountryChange(): void {
    this.selectedCity = null;
    if (this.isSubmitted) {
      this.clearValidationErrors();
    }
  }

  getCountryName(id: number | null): string {
    if (!id) return '';
    const country = this.countries.find(c => c.id === id);
    return country ? country.name : '';
  }

  getCityName(id: number | null): string {
    if (!id) return '';
    const city = this.cities.find(c => c.id === id);
    return city ? city.name : '';
  }

  clearValidationErrors(): void {
    this.countryError = '';
    this.cityError = '';
    this.colorError = '';
    this.fullbodyError = '';
    this.activeError = '';
  }

  validateForm(): boolean {
    this.clearValidationErrors();
    let isValid = true;

    if (!this.selectedCountry) {
      this.countryError = 'გთხოვთ აირჩიოთ ქვეყანა';
      isValid = false;
    }

    if (!this.selectedCity) {
      this.cityError = 'გთხოვთ აირჩიოთ ქალაქი';
      isValid = false;
    }

    if (!this.selectedColor) {
      this.colorError = 'გთხოვთ აირჩიოთ ფერი';
      isValid = false;
    }

    if (!this.fullbody || this.fullbody.trim().length === 0) {
      this.fullbodyError = 'გთხოვთ შეიყვანოთ ინფორმაცია';
      isValid = false;
    } else if (this.fullbody.length < 5) {
      this.fullbodyError = 'ინფორმაცია უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს';
      isValid = false;
    } else if (this.fullbody.length > 500) {
      this.fullbodyError = 'ინფორმაცია უნდა შეიცავდეს მაქსიმუმ 500 სიმბოლოს';
      isValid = false;
    }

    if (!this.active) {
      this.activeError = 'გთხოვთ დააყენოთ აქტიური';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (!this.validateForm()) {
      return;
    }

    this.submittedData = {
      countryId: this.selectedCountry,
      countryName: this.getCountryName(this.selectedCountry),
      cityId: this.selectedCity,
      cityName: this.getCityName(this.selectedCity),
      color: this.selectedColor,
      fullbody: this.fullbody,
      active: this.active
    };
  }
}
