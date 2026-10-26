import java.util.ArrayList;
import java.util.Scanner;

public class Examen2Parcial_Marquez_Saul {
    public static void main(String[] args) {
        
        ArrayList<String> nombre_cliente = new ArrayList<>();
        ArrayList<String> cliente_compra = new ArrayList<>();
        ArrayList<String> producto_compra = new ArrayList<>();
        ArrayList<Integer> pago_compra = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);

        int[] cuanto_vendio = new int[4];


        String[] nombre_producto = new String[4];


        nombre_producto[0] = "Chocolate";
        nombre_producto[1] = "Paleta";
        nombre_producto[2] = "Gomitas";
        nombre_producto[3] = "Galletas";

        int[] precio_producto = new int[4];

        precio_producto[0] = 18;
        precio_producto[1] = 12;
        precio_producto[2] = 25;
        precio_producto[3] = 15;

        System.out.println("Bienvenido a la dulceria");


        System.out.println("Nuestro catalogo es: ");
        System.out.println("");

        System.out.println("Codigo | Producto | Precio |");
        System.out.println("----------------------------");
        System.out.println("   1   | Chocolate|     18 |");
        System.out.println("----------------------------");
        System.out.println("   2   |   Paleta |     12 |");
        System.out.println("----------------------------");
        System.out.println("   3   |  Gomitas |     25 |");
        System.out.println("----------------------------");
        System.out.println("   4   | Galletas |     15 |");
        System.out.println("----------------------------");
        System.out.println("");

        int jornada = 0;

        int cantidad_chocolate = 0;
        int resultado_chocolate = 0;

        int cantidad_paleta = 0;
        int resultado_paleta = 0;

        int cantidad_gomitas = 0;
        int resultado_gomitas = 0;

        int cantidad_galletas = 0;
        int resultado_galletas = 0;

        int agregar;

        int contador = 0;
        int total_gastado = 0;

        do {
            contador++;

            System.out.println("¿Cual es su nombre?... ");
            String nombre = scanner.nextLine();
            nombre_cliente.add(nombre);

            cantidad_chocolate = 0;
            resultado_chocolate = 0;
            cantidad_paleta = 0;
            resultado_paleta = 0;
            cantidad_gomitas = 0;
            resultado_gomitas = 0;
            cantidad_galletas = 0;
            resultado_galletas = 0;

            do {

            int numero_producto = Integer.parseInt(IO.readln("¿Cual producto vas a querer?: "));
        
            switch(numero_producto){
                case 1:

                    do {

                        cantidad_chocolate = Integer.parseInt(IO.readln("¿Cuantos Chocolates va a querer (debe ser mayor o igual a 1)?: "));
                    
                    } while (cantidad_chocolate < 1);

                        resultado_chocolate = cantidad_chocolate * precio_producto[0];
                        System.out.println("Su total a pagar del chocolate es: " + resultado_chocolate);

                        cuanto_vendio[0] = cantidad_chocolate;
                        cliente_compra.add(nombre);
                        producto_compra.add(nombre_producto[0]);
                        pago_compra.add(resultado_chocolate);

                break;
                case 2:

                    do {

                        cantidad_paleta = Integer.parseInt(IO.readln("¿Cuantas paletas va a querer (debe ser mayor o igual a 1)?: "));
                    
                    } while (cantidad_paleta < 1);

                        resultado_paleta = cantidad_paleta * precio_producto[1];
                        System.out.println("Su total a pagar de las paletas es: " + resultado_paleta);

                        cuanto_vendio[1] = cantidad_paleta;
                        cliente_compra.add(nombre);
                        producto_compra.add(nombre_producto[1]);
                        pago_compra.add(resultado_paleta);


                break;
                case 3:

                    do {

                        cantidad_gomitas = Integer.parseInt(IO.readln("¿Cuantas gomitas va a querer (debe ser mayor o igual a 1)?: "));
                    
                    } while (cantidad_gomitas < 1);

                        resultado_gomitas = cantidad_gomitas * precio_producto[2];
                        System.out.println("Su total a pagar de las gomitas es: " + resultado_gomitas);

                        cuanto_vendio[2] = cantidad_gomitas;
                        cliente_compra.add(nombre);
                        producto_compra.add(nombre_producto[2]);
                        pago_compra.add(resultado_gomitas);

                break;
                case 4:

                    do {

                        cantidad_galletas = Integer.parseInt(IO.readln("¿Cuantas galletas va a querer (debe ser mayor o igual a 1)?: "));
                    
                    } while (cantidad_galletas < 1);

                        resultado_galletas = cantidad_galletas * precio_producto[3];
                        System.out.println("Su total a pagar de las galletas es: " + resultado_galletas);

                        cuanto_vendio[3] = cantidad_galletas;
                        cliente_compra.add(nombre);
                        producto_compra.add(nombre_producto[3]);
                        pago_compra.add(resultado_galletas);

                break;
            }

            agregar = Integer.parseInt(IO.readln("Quiere agregar otro producto al carrito? (1/0)"));

            } while (agregar == 1);

            System.out.println("Su importe de cada dulce: ");
            System.out.println("");

            System.out.println("Producto | Precio | cantidad vendida |Lo que debe pagar");
            System.out.println("-------------------------------------------------------");
            System.out.println("Chocolate|     18 |       " + cuanto_vendio[0] + "           |  " + resultado_chocolate);
            System.out.println("-------------------------------------------------------");
            System.out.println("Paleta   |     12 |       " + cuanto_vendio[1] + "           |  " + resultado_paleta);
            System.out.println("-------------------------------------------------------");
            System.out.println("Gomitas  |     25 |       " + cuanto_vendio[2] + "           |  " + resultado_gomitas);
            System.out.println("-------------------------------------------------------");
            System.out.println("Galletas |     15 |       " + cuanto_vendio[3] + "           |  " + resultado_galletas);
            System.out.println("-------------------------------------------------------");
            System.out.println("");
            int resultado_total = resultado_chocolate + resultado_galletas + resultado_gomitas + resultado_paleta;
            System.out.println("Su total a pagar es de: " + resultado_total);
            total_gastado += resultado_total;

            jornada = Integer.parseInt(IO.readln("¿Hay mas clientes? (1/0)"));

        } while (jornada == 1);






        
        System.out.println("Hubo " + contador + " clientes atendidos");
        System.out.println("");
        System.out.println("Tabla de compras de la jornada");
        System.out.println("");
        
        System.out.println("Cliente | Producto | Pago");
        System.out.println("--------------------------");
        
        for (int i = 0; i < cliente_compra.size(); i++) {
            System.out.println(cliente_compra.get(i) + " | " + producto_compra.get(i) + " | " + pago_compra.get(i) + " pesitos");
        }

        double promedio = (double) total_gastado / contador;
        System.out.println("");
        System.out.println("El promedio que gasto cada cliente fue de: " + promedio + " pesitos");

    }
}
