void main() {    

    int opcion_principal, precio_metro_cuadrado, precio_cercado;

    do {

        System.out.println("Bienvenido a la calculadora :D");
        
        System.out.println("1) Triangulos");
        System.out.println("2) cuadrado");
        System.out.println("3) rectangulo");
        System.out.println("4) Circulo");
        System.out.println( "0) salir");

        opcion_principal = Integer.parseInt(IO.readln("Selecciona una opcion: "));
        precio_metro_cuadrado = Integer.parseInt(IO.readln("Ingrese el precio por metro cuadrado: "));        
        precio_cercado = Integer.parseInt(IO.readln("Ingrese el precio por metro del cercado: "));        
        
        //String opcion_principal = IO.readln("Seleccion una opcion ").chartAT(0);

        if (opcion_principal == 1){
            limpiarpantalla.borrar();
            int opcion_metodo_triangulo;

            System.out.println("Seleccionates los triangulos :D");

            System.out.println("Los metodos de medidas: ");

            System.out.println("1) Usar coordenadas para calcular distancias euclidianas");
            System.out.println("2) usar dimensiones (catetos)");
            System.out.println("3) usar angulos y catetos");

            opcion_metodo_triangulo = Integer.parseInt(IO.readln("¿que tipo de medidas quieres utilizar? "));

            switch(opcion_metodo_triangulo) {
                case 1:


                break;
                case 2:

                break;
                case 3:



                break;
            }





            System.out.println("Termino el programa :P");
        
            System.out.println("1) Volver al inicio");
            System.out.println( "0) salir");
            opcion_principal = Integer.parseInt(IO.readln("Selecciona una opcion: "));
            limpiarpantalla.borrar();
        }

        if (opcion_principal == 2){
            limpiarpantalla.borrar();
            int opcion_metodo_cuadrado;

            System.out.println("Seleccionates el cudradooo :P");

            System.out.println("Los metodos de medidas: ");

            System.out.println("1) Usar coordenadas para calcular distancias euclidianas");
            System.out.println("2) usar dimensiones (catetos)");
            System.out.println("3) usar angulos y catetos");

            opcion_metodo_cuadrado = Integer.parseInt(IO.readln("¿que tipo de medidas quieres utilizar? "));

            switch(opcion_metodo_cuadrado) {
                case 1:

                break;
                case 2:

                break;
                case 3:



                break;
            }





            System.out.println("Termino el programa :P");
        
            System.out.println("1) Volver al inicio");
            System.out.println( "0) salir");
            opcion_principal = Integer.parseInt(IO.readln("Selecciona una opcion: "));
            limpiarpantalla.borrar();
        }


        if (opcion_principal == 3){
            limpiarpantalla.borrar();
            int opcion_metodo_rectangulo;

            System.out.println("Seleccionates el rectangulo :>");

            System.out.println("Los metodos de medidas: ");

            System.out.println("1) Usar coordenadas para calcular distancias euclidianas");
            System.out.println("2) usar dimensiones (catetos)");
            System.out.println("3) usar angulos y catetos");

            opcion_metodo_rectangulo = Integer.parseInt(IO.readln("¿que tipo de medidas quieres utilizar? "));

            switch(opcion_metodo_rectangulo) {
                case 1:

                break;
                case 2:

                break;
                case 3:



                break;
            }





            System.out.println("Termino el programa :P");
        
            System.out.println("1) Volver al inicio");
            System.out.println( "0) salir");
            opcion_principal = Integer.parseInt(IO.readln("Selecciona una opcion: "));
            limpiarpantalla.borrar();
        }

        if (opcion_principal == 4){
            limpiarpantalla.borrar();
            int opcion_metodo_circulo;

            System.out.println("Seleccionates al circuloo :)");

            System.out.println("Los metodos de medidas: ");

            System.out.println("1) Usar coordenadas para calcular distancias euclidianas");
            System.out.println("2) usar dimensiones (catetos)");
            System.out.println("3) usar angulos y catetos");

            opcion_metodo_circulo = Integer.parseInt(IO.readln("¿que tipo de medidas quieres utilizar? "));

            switch(opcion_metodo_circulo) {
                case 1:

                break;
                case 2:

                break;
                case 3:



                break;
            }





            System.out.println("Termino el programa :P");
        
            System.out.println("1) Volver al inicio");
            System.out.println( "0) salir");
            opcion_principal = Integer.parseInt(IO.readln("Selecciona una opcion: "));
            limpiarpantalla.borrar();
        }
        
    } while (opcion_principal != 0);


}

