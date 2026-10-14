public class ciclos_anidado {

    public static void main(String[] args) {


        int compra_helado;
        int costo = 0;
        int costo2 = 0;

        for (int i = 1; i < 3; i++) {

            System.out.println("Estamos en el dia " + i + ", Hay de estos sabores: ");
            System.out.println("");

            System.out.println("1) fresa, 15 pesitos");
            System.out.println("2) vainilla, 12 pesitos");
            System.out.println("3) chocolate, 18 pesitos");
            System.out.println("");

            int cantidad = Integer.parseInt(IO.readln("Cuantos helados vas a querer? "));

            for (int j = 0; j < cantidad; j++) {
                
                System.out.println("");
                compra_helado = Integer.parseInt(IO.readln("El helado numero " + (j + 1) + ", va a ser del numero: "));
                System.out.println("");

                if (i == 2){

                    if (compra_helado == 1) {
                        costo2 += 15;
                    } else if (compra_helado == 2) {
                        costo2 += 12;
                    } else if (compra_helado == 3) {
                        costo2 += 18;
                    }



                } else if (i == 1) {

                        if (compra_helado == 1) {
                        costo += 15;
                    } else if (compra_helado == 2) {
                        costo += 12;
                    } else if (compra_helado == 3) {
                        costo += 18;
                    }


                }

            }

            
            if (i == 1) {

                System.out.println("Tu total por los helados del dia 1 es de: " + costo);

            } else if (i == 2) {

                System.out.println("Tu total por los helados del dia 2 es de: " + costo2);

            }


            System.out.println("");

        }

        int resultado = costo + costo2;

        System.out.println("Tu total por los helados de los dos dias son de: " + resultado);
    }
}
