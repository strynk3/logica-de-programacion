import java.util.Random;
import java.util.ArrayList;

public class carrer {
    
    public static void main(String[] args) {
        Random rand = new Random();


        // &&&&&&&&&&&&&&______ETAPA 1______&&&&&&&&&&&&&&

        int aleatorio = Integer.parseInt(IO.readln("Escribe un numero aleatorio (no tan grande): "));

        int mes = Integer.parseInt(IO.readln("En que mes naciste?: "));


        int numero_1 = rand.nextInt(50);
        int numero_2 = rand.nextInt(50);
        int numero_3 = rand.nextInt(50);
        int numero_4 = rand.nextInt(50);
        int numero_5 = rand.nextInt(50);

        int operacion_promedio = numero_1 + numero_2 + numero_3 + numero_4 + numero_5;
        int promedio = operacion_promedio / 5;

        int salida_1 = aleatorio + promedio;


        // &&&&&&&&&&&&&&______ETAPA 2______&&&&&&&&&&&&&&

        double residuo = salida_1 % 7;

        double salida_2 = salida_1 + residuo;


        // &&&&&&&&&&&&&&______ETAPA 3______&&&&&&&&&&&&&&

        double porcentaje = 100 / (salida_2 * 12);

        double salida_3 = salida_2 + porcentaje;

        // &&&&&&&&&&&&&&______ETAPA 4______&&&&&&&&&&&&&&


        int n = Integer.parseInt(IO.readln("Vas a sumar n numeros, escoge cuantos numeros quieres sumar: "));
        int suma = 0;

        ArrayList<Integer> numeros = new ArrayList<>();

        if (n > 0) {

            for (int i = 0; i < n; i++) {
                int numero = Integer.parseInt(IO.readln("Escribe el numero que se va a sumar: "));
                numeros.add(numero);
            }

            for (int i = 0; i < numeros.size(); i++) {
                suma += numeros.get(i);
            }
        }

        double salida_4 = salida_3 + suma;


        // &&&&&&&&&&&&&&______ETAPA 5______&&&&&&&&&&&&&&

        int divisor = 0;
        double salida_5 = 0;

            divisor = Integer.parseInt(IO.readln("Escoge un divisor entre el 1-9: "));

            salida_5 = salida_4 / divisor; 


        // &&&&&&&&&&&&&&______SWITCH DE MESES______&&&&&&&&&&&&&&


        double salida_5_1 = salida_5;
        int resultado = (int) salida_5;

        double decimales = salida_5_1 - (long) salida_5_1;
        double resultado_2 = ((long) (decimales * 10000)) / 10000.0;

        switch(mes) {

        case 1:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);
        
           break;

        case 2:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;
        
        case 3:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);        
           break;

        case 4:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;

        case 5:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);

           break;

        case 6:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;

        case 7:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);

           break;

        case 8:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;

        case 9:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);

           break;

        case 10:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;

        case 11:

           System.out.println("Tu mes es impar y las ultimas 4 decimales son: " + resultado_2);

           break;

        case 12:

           System.out.println("Tu mes es par y el valor de la ultima salida es... " + resultado);
        
           break;
        }

        




    }

}
