# 17-BaaS

**Firebase**

Le but de ces exercices est de créer une application de gestion de mot de passe.  

Exercice 1 :  
Créer un nouveau projet react native  

Exercice 2 :  
S’inscrire sur https://firebase.google.com/ , puis créer un projet. Activer l’authentification par mail et mot de passe.  

Exercice 3 :  
Dans l’application mobile, faire deux formulaires dans deux écrans séparés :
• La page d’inscription. Elle permet de s’inscrire sur l’application. Les données devront être stockées dans la partie Authentification de Firebase.
• La page connexion. Elle permet de se connecter à l’application. La vérification devra se faire via Firebase. Si la connexion réussi rediriger vers une troisième pas qui affichera 
« Bonjour adresseMail ».  
Pour utiliser firebase dans une application Reactnative utiliser https://rnfirebase.io/  

Exercice 4 :  
Avec Firestore Database, enregistrer un premier mot de passe avec les informations suivantes :
• Login : string (identifiant)
• Password : string (mot de passe)
• Name : string (nom du site ou de l’application)
• Type : String (Appli mobile ou site web)
Ceci est la structure minimale. Elle peut être améliorer si besoin.  

Exercice 5 :  
Faire les différents écrans permettant d’afficher, de créer, de modifier et de supprimer les mots de passe enregistrés.  
Pour l’affichage, les mots de passes devront être caché par défaut.  

-------

Avec la nouvelle version de React 18, react Native a des soucis avec React Navigation. Il faut donc créer le projet avec cette ligne de commande :  
$ npx react-native init p17BaaS --template react-native-template-typescript@6.10.2 

Installer les packages :  
$ npm install @react-navigation/native @react-navigation/native-stack  
$ npm install react-native-screens react-native-safe-area-context  
$ npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view  

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

