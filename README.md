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
$ $ npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view  
