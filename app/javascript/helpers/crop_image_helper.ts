import Croppie from "croppie";
import "croppie/croppie.css";

export class CropImageHelper {
  private imageFile;
  private croppie;

  constructor(croppieFiled: HTMLElement) {
    this.croppie = new Croppie(croppieFiled, {
      viewport: { width: 200, height: 200, type: "circle" },
      boundary: { width: 300, height: 300 },
      showZoomer: true,
    });
  }

  fetchImageFile(imageField: HTMLInputElement): void {
    this.imageFile = imageField.files[0];
  }

  isValidImage(): boolean {
    return this.imageFile.size / 1048576 <= 5;
  }

  bindURL(): void {
    console.log("bindURL");
    this.croppie.bind({
      url: window.URL.createObjectURL(this.imageFile),
    });
    console.log(this.croppie);
  }

  resultantImage(): Promise<void> {
    return this.croppie.result({
      type: "blob",
      size: "original",
      format: "png",
      quality: 1,
      circle: false,
    });
  }
}
