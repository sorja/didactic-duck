Määrittely Dokumentti
=====================

Projektini ideana on vertailla A* muihin reitinhakuihin ja
mahdollistaa eri asetusten muuttamisen (esim. heuristiikka).
A* vaikuttaa mielenkiintoiselta lähtökohdalta, kun lähdetään
tutkimaan reitinhakualgoritmeja. Ideana on myös toteuttaa muita
reitinhakualgoritmejä, esim A* spesiaalitapaus Dijkstran algoritmi
(kun heurestiikka on 0). Tietorakenteina käytän apuna linkitettyä
listaa pitämään muistissa läpi käydyt solmut.

Ongelman mitä tahdotaan ratkaista, on lyhin matka pisteestä A pisteeseen B.
Tähän A* sopinee parhaiten, ja linkitetyn listan kayttaminen helpottaa
huomattavasti algoritmin toteutusta.

Syötteitä käyttäjältä ohjelma saa vain päätepisteen. Alkupiste on
ensimmäisessä vaiheessa satunnainen (kuin päätepiste), jonka jälkeen
käyttä valitsee uuden päätepisteen. Tällöin aikaisemmasta päätepisteestä
tulee alkupiste, ja haetaan reitti käyttäjän valitsemaan pisteeseen.

Lähteet (29.7.2015)
https://en.wikipedia.org/wiki/A*_search_algorithm

