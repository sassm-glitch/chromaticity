from PIL import Image
import PyOpenColorIO as ocio
import os

# Configurer OCIO avec ton chemin config.ocio
os.environ["OCIO"] = r"C:\Users\sofia\Downloads\imageworks-OpenColorIO-Configs-v1.0_r2-8-g0bb079c(2)\imageworks-OpenColorIO-Configs-0bb079c\spi-vfx\config.ocio"

# 1. Charger l'image
def charger_image(chemin_image):
    try:
        image = Image.open(chemin_image)
        print("Image chargée avec succès.")
        return image
    except Exception as e:
        print(f"Erreur lors du chargement de l'image : {e}")
        return None

# 2. Conversion des couleurs avec OCIO
def convertir_couleurs_ocio(image, espace_source, espace_cible):
    try:
        config = ocio.GetCurrentConfig()
        processor = config.getProcessor(espace_source, espace_cible)
        transform = processor.getDefaultCPUProcessor()

        # Convertir les pixels
        pixels = list(image.getdata())
        converted_pixels = []

        for pixel in pixels:
            normalized_pixel = [value / 255 for value in pixel[:3]]
            if len(pixel) == 4:
                normalized_pixel.append(pixel[3] / 255)  # Inclure alpha

            converted_pixel = transform.applyRGB(normalized_pixel[:3])
            converted_pixel = [int(value * 255) for value in converted_pixel]

            if len(pixel) == 4:
                converted_pixel.append(pixel[3])  # Garder alpha inchangé

            converted_pixels.append(tuple(converted_pixel))

        new_image = Image.new("RGBA" if len(pixel) == 4 else "RGB", image.size)
        new_image.putdata(converted_pixels)
        return new_image
    except Exception as e:
        print(f"Erreur lors de la conversion des couleurs : {e}")
        return None

# 3. Sauvegarder l'image
def sauvegarder_image(image, chemin_sortie):
    try:
        image.save(chemin_sortie)
        print(f"Image sauvegardée sous : {chemin_sortie}")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde de l'image : {e}")

# 4. Programme principal
def main():
    try:
        print("Bienvenue dans le convertisseur d'espaces de couleurs avec OCIO !")
        
        chemin_image = input("Entrez le chemin de votre image : ")
        image = charger_image(chemin_image)

        if image:
            config = ocio.GetCurrentConfig()
            espaces_disponibles = [cs.getName() for cs in config.getColorSpaces()]
            print(f"Espaces de couleurs disponibles : {', '.join(espaces_disponibles)}")

            espace_source = input("Entrez l'espace de couleur source : ")
            espace_cible = input("Entrez l'espace de couleur cible : ")

            if espace_source in espaces_disponibles and espace_cible in espaces_disponibles:
                image_convertie = convertir_couleurs_ocio(image, espace_source, espace_cible)

                if image_convertie:
                    chemin_sortie = input("Entrez le chemin pour sauvegarder l'image convertie : ")
                    sauvegarder_image(image_convertie, chemin_sortie)
                else:
                    print("Erreur lors de la conversion de l'image.")
            else:
                print("Erreur : Espaces de couleur invalides.")
    except Exception as e:
        print(f"Erreur générale : {e}")

if __name__ == "__main__":
    main()
