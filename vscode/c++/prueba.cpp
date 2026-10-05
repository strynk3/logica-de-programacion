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

int main() {
    float numero_de_semanas;
    
    float residuos_organicos, residuos_inorganicos, residuos_reciclables;
    float residuos_organicos_semana2, residuos_inorganicos_semana2, residuos_reciclables_semana2;
    float residuos_organicos_semana3, residuos_inorganicos_semana3, residuos_reciclables_semana3;

    system("cls");

    gotoxy(10, 3);
    cout << "//////////---holaa, bienvenido al reciclaje---///////////" << endl << endl;

    gotoxy(1, 5);
    cout << "Basandote en el siguiente ejemplo, escribe cuantos residuos has generado durante la semana:" << endl;

    gotoxy(5, 7); cout << "_______________________________" << endl;
    gotoxy(5, 8); cout << "|semanas     |    residuos(kg) |" << endl;
    gotoxy(5, 9); cout << "|    1       |        10       |" << endl;
    gotoxy(5, 10); cout << "|    2       |        5        |" << endl;
    gotoxy(5, 11); cout << "|    3       |        8        |" << endl;
    gotoxy(5, 12); cout << "|------------------------------|" << endl;

    gotoxy(5, 15);
    cout << "Cuantas semanas quiere calcular? (mas de 2 semanas): ";
    cin >> numero_de_semanas;

    while (numero_de_semanas <= 2) {
        gotoxy(5, 18);
        cout << "                                                                                ";
        gotoxy(5, 18);
        cout << "error, vuelva a introducir un numero valido de semanas: ";
        cin >> numero_de_semanas;
    }

    if (numero_de_semanas >= 3) {
        gotoxy(5, 18); cout << "                                                                                ";

        system("cls");
        gotoxy(5, 2); cout << "--- SEMANA 1 ---" << endl;
        gotoxy(5, 4); cout << "Cuantos residuos has generado de organicos?: "; cin >> residuos_organicos;
        gotoxy(5, 5); cout << "Cuantos residuos has generado de reciclables?: "; cin >> residuos_reciclables;
        gotoxy(5, 6); cout << "Cuantos residuos has generado de inorganicos?: "; cin >> residuos_inorganicos;

        system("cls");
        gotoxy(5, 2); cout << "--- SEMANA 2 ---" << endl;
        gotoxy(5, 4); cout << "Cuantos residuos has generado de organicos?: "; cin >> residuos_organicos_semana2;
        gotoxy(5, 5); cout << "Cuantos residuos has generado de reciclables?: "; cin >> residuos_reciclables_semana2;
        gotoxy(5, 6); cout << "Cuantos residuos has generado de inorganicos?: "; cin >> residuos_inorganicos_semana2;

        system("cls");
        gotoxy(5, 2); cout << "--- SEMANA 3 ---" << endl;
        gotoxy(5, 4); cout << "Cuantos residuos has generado de organicos?: "; cin >> residuos_organicos_semana3;
        gotoxy(5, 5); cout << "Cuantos residuos has generado de reciclables?: "; cin >> residuos_reciclables_semana3;
        gotoxy(5, 6); cout << "Cuantos residuos has generado de inorganicos?: "; cin >> residuos_inorganicos_semana3;

        system("cls");

        // Organicos
        float tasa1_org = (residuos_organicos_semana2 / residuos_organicos) - 1;
        float tasa2_org = (residuos_organicos_semana3 / residuos_organicos_semana2) - 1;
        float promedio_final_organico = (tasa1_org + tasa2_org) / 2;

        // Reciclables
        float tasa1_rec = (residuos_reciclables_semana2 / residuos_reciclables) - 1;
        float tasa2_rec = (residuos_reciclables_semana3 / residuos_reciclables_semana2) - 1;
        float promedio_final_reciclables = (tasa1_rec + tasa2_rec) / 2;

        // Inorganicos
        float tasa1_ino = (residuos_inorganicos_semana2 / residuos_inorganicos) - 1;
        float tasa2_ino = (residuos_inorganicos_semana3 / residuos_inorganicos_semana2) - 1;
        float promedio_final_inorganico = (tasa1_ino + tasa2_ino) / 2;

        gotoxy(1, 2);
        cout << "Tabla de proyeccion de residuos (Semanas 1 a 10): " << endl;

        gotoxy(1, 4); cout << "____________________________________________________________________________________" << endl;
        gotoxy(1, 5); cout << "| semanas  |  proyeccion(organico)  |  proyeccion(reciclable)  |  proyeccion(inorg) |" << endl;
        gotoxy(1, 6); cout << "|----------|------------------------|--------------------------|--------------------|" << endl;

        int fila = 7; 

        for (int i = 1; i = numero_de_semanas; i++) {
            float resultado_org = residuos_organicos * pow(1 + promedio_final_organico, i);
            float resultado_rec = residuos_reciclables * pow(1 + promedio_final_reciclables, i);
            float resultado_ino = residuos_inorganicos * pow(1 + promedio_final_inorganico, i);

            gotoxy(1, fila);
            cout << "|    " << i << "\t   |        " << resultado_org << "\t    |        " << resultado_rec << "\t       |        " << resultado_ino << "\t    |" << endl;
            fila++;
        }

        gotoxy(1, fila);
        cout << "|-----------------------------------------------------------------------------------|" << endl;

        gotoxy(0, fila + 3);
        system("pause");
        return 0;
    }
}