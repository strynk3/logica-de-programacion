void main() {

double imc;

int personas = Integer.parseInt(IO.readln("¿Cuantas personas quieren su consulta de imc?: "));

for (int i = 0; i < personas; i++ ){

    // int edad = Integer.parseInt(IO.readln("ingrese la edad de la persona " + i + " : "));

    double kilos = Double.parseDouble(IO.readln("ingrese el peso de la persona " + i + " en kilos: "));

    double estatura = Double.parseDouble(IO.readln("ingrese la estatura de la persona " + i + " en metros: "));

    System.out.println();

    imc = kilos / (estatura * estatura);


    if(imc < 18.5){

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas bajo de peso. ");

        System.out.println("Como recomendacion, deberias empezar a ver un nutricionaista para una alimentacion mas balanceada.");

        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();
        }

    } else if (imc > 18.5 && imc < 24.9) {

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas en un peso normal. ");

        System.out.println("Como recomendacion, deberias mantener tu alimentacion sin bajas o subir el porcentaje de grasas.");
        
        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();

        }
    } else if (imc > 25 && imc < 29.9) {

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas en sobrepeso. ");

        System.out.println("Como recomendacion, deberias empezar a comer menos comida grasa y comida chatarra.");

        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();

        }
    } else if (imc > 30 && imc < 34.9) {

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas en obesidad tipo 1. ");

        System.out.println("Como recomendacion, deberias empezar a ver un especialista para manejar tu situacion de forma inmediata.");
        
        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();

        }  

    } else if (imc > 35 && imc < 39.9) {

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas en obesidad tipo 2. ");

        System.out.println("Como recomendacion, deberias ir por tratamiento para tu salud que se esta viendo perjudicada a un nivel grave.");
        
        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();

        } 
    
    }else if (imc > 40) {

        System.out.println("El imc de la persona " + i +" es de " + imc + ", estas en obesidad tipo 3 (morbida). ");

        System.out.println("Como recomendacion, deberias recirbir atencion y tratamiento medio para vivir.");
        
        System.out.println();
        char opcion = IO.readln("Quieres ver la tabla de IMC? (y/n): ").charAt(0);

        switch(opcion) {
            case 'y': 

                System.out.println();
                System.out.println("Bajo peso   | Menos 18.5");
                System.out.println("peso normal | 18.5 a 24.9");
                System.out.println("sobrepeso   | 25.0 a 29.9");
                System.out.println("obesidad    | 30.0 o mas");
                System.out.println();

        } 
   
    }   
}

}
