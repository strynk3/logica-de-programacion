import java.util.Arrays;

public class ejercicio {
    public static void main(String[] args) {
        
    int[] numeros;
    numeros = new int[10];

    for (int i = 0; i < numeros.length; i++){
    System.out.println("Ingrese 10 numeros, el valor del numero  " + i + " es: ");
    numeros[i] = Integer.parseInt(IO.readln());
    }
    
    for(int j = 0; j < numeros.length; j++) {

        System.out.println("De mayor a menor: ");
        System.out.println("El numero de la posicion: " + j + " es " + numeros[j]);
    }

    Arrays.sort(numeros);
    
        System.out.println("");
        System.out.println("El dato menor es: ");
        System.out.println(numeros[0]);

        System.out.println("El dato mayor es: ");
        System.out.println(numeros[9]);




    }
}
