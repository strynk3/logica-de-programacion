
public class limpiarpantalla {
    
    public static void borrar(){
        System.out.println("\033[H\033[2J");
        System.out.flush();
    }

}
