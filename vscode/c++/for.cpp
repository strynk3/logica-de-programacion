#include <iostream>
#include <windows.h>
#include <cstdlib>
#include <cmath>

using namespace std;

void gotoxy(int x, int y) {
    HANDLE hcon = GetStdHandle(STD_OUTPUT_HANDLE);
    COORD dwPos;
    dwPos.X = x;
    dwPos.Y = y;
    SetConsoleCursorPosition(hcon, dwPos);
}

int main(){

    int seleccion;

    system("cls");

    gotoxy(2,3); cout<<"hellooo"<<endl;
    gotoxy(2,5); cout<<"vamos a hacer un repaso del ciclo for. :D"<<endl;

        gotoxy(3,6); cout<<"1.- ciclos for."<<endl;
        gotoxy(3,7); cout<<"2.- ciclos while"<<endl;
        gotoxy(3,8); cout<<"3.- ciclos do-while"<<endl;

    gotoxy(2,10); cout<<"Escoga un apartado... "; cin>>seleccion;

 while (seleccion >= 4) {
        gotoxy(5, 12);
        cout << "                                                                                ";
        gotoxy(5, 12);
        cout << "error, vuelva a introducir un numero valido: ";
        cin >> seleccion;
    }

    if(seleccion == 1){
        system("cls");
        
        gotoxy(2,3); cout<<"aqui tienes unos ejemplos basicos del ciclo for: "<<endl;

        gotoxy(3,5); cout<<"piramide de asteriscos: ";

        for(int i = 0; i == 10; i++){
            cout<<"*";
            cout<<endl;
        }
    }


    gotoxy(2,15); system("pause");
    return 0;

}