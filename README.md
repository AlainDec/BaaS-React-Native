# 17-BaaS

**Application de gestion de mot de passe avec Firebase**

1 : Création projet React Native  

2 : Inscription sur https://firebase.google.com/ , puis créer un projet. Activer l’authentification par mail et mot de passe.  

3 : Dans l’app mobile, faire deux formulaires dans deux écrans séparés :
• La page d’inscription. Elle permet de s’inscrire sur l’application. Les données devront être stockées dans la partie Authentification de Firebase.
• La page connexion. Elle permet de se connecter à l’application. La vérification devra se faire via Firebase. Si la connexion réussie, rediriger vers une troisième page qui affichera les données.  
Infos d'utiliation de Firebase dans une app React Native : https://rnfirebase.io/  

4 : Avec Firestore Database, enregistrer un mot de passe avec les informations suivantes :
• Login : string (identifiant)
• Password : string (mot de passe)
• Name : string (nom du site ou de l’application)
• Type : String (Appli mobile ou site web)
Structure minimale qui peut être améliorée...  

5 : Création des différents écrans permettant d’afficher, créer, modifier et supprimer les mots de passe enregistrés.  
Pour l’affichage, les mots de passes sont cachés par défaut.  

6 : En utilisant https://rnmmkv.vercel.app/#/ , faire en sorte que quand un utilisateur se connecte, cela enregistre ses identifiants de connexion pour qu’il puisse se loguer automatiquement les prochaines fois.  
A la déconnexion, suppression de ses identifiants de connexion.  

7. Connexion avec la Biométrie  

8. Transfère des photos depuis la galerie vers FireStore  

-------

![Screenshot_20220718-143437_p17BaaS](https://user-images.githubusercontent.com/35977024/179517415-1b436a3e-ae6c-453c-b957-3b0462f92d3a.jpg)
![Screenshot_20220718-143457_p17BaaS](https://user-images.githubusercontent.com/35977024/179517412-890c7164-7148-4898-95c8-e56b8ba8a03d.jpg)
![Screenshot_20220718-143858_p17BaaS](https://user-images.githubusercontent.com/35977024/179517416-21e37522-be72-452f-abfb-557d850c66f6.jpg)
![Screenshot_20220718-143625_p17BaaS](https://user-images.githubusercontent.com/35977024/179517407-c9d4c88b-e3d1-4505-88af-6cf7ec1c9f56.jpg)
![Screenshot_20220718-144145_p17BaaS](https://user-images.githubusercontent.com/35977024/179517405-d2c13e6c-0b60-4bb3-8fa5-699534ecff17.jpg)


Avec la nouvelle version de React 18, react Native a des soucis avec React Navigation. Il faut donc créer le projet avec cette ligne de commande :  
$ npx react-native init p17BaaS --template react-native-template-typescript@6.10.2 

Installer les packages :  
$ npm install @react-navigation/native @react-navigation/native-stack  
$ npm install react-native-screens react-native-safe-area-context  
$ npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view  
Les icônes:  
$ npm install --save react-native-vector-icons  
$ npm i --save-dev @types/react-native-vector-icons  
Editer le fichier android/app/build.gradle (MAIS PAS android/build.gradle) et ajouter en bas :  
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"  
$ npm install react-native-vector-icons react-native link react-native-vector-icons  

Installer React Native Firebase  
$ npm install --save @react-native-firebase/app  

Installer le module d'authentification de Firebase. Ca fournit des services backend et des SDK faciles à utiliser pour authentifier les utilisateurs. Il prend en charge l'authentification à l'aide de mots de passe, de numéros de téléphone, de fournisseurs d'identité fédérés populaires comme Google, Facebook et Twitter, et plus encore.  
$ npm install @react-native-firebase/auth

Gestion des formulaires avec React Hook Form  
$ npm install react-hook-form  
un bon tuto vidéo : https://www.youtube.com/watch?v=6DRAg26QtPI&list=PLpepLKamtPjh-xbBONWs42XNNSbtz3VGc&index=7&ab_channel=WawaSensei  

Gestion des règles de validations des formulaires avec YUP  
$ npm i yup  

Yup a besoin d'un resolver et donc de sa librairie :  
$ npm install @hookform/resolvers  

Doc d'inspiration : https://blog.logrocket.com/email-authentication-react-native-react-navigation-firebase/  

4/ : créer la DB : https://console.firebase.google.com/project/lamanubaas/firestore  
$ npm install @react-native-firebase/app  
$ npm install @react-native-firebase/firestore  

6/ : installer la lib :  
$ npm install react-native-mmkv-storage  

7/ : biométrie  
$ npm i react-native-biometrics  

8/ : Gestion de la galerie photo  
$ npm i react-native-image-picker  

Ajouter dans le fichier android/app/src/debug/AndroidManifest.xml :  
```
<uses-permission android:name="android.permission.CAMERA"/>  
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>  
```

